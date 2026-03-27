package proxy

import (
	"fmt"
	"io"
	"net/http"
	"net/url"
	"time"

	"github.com/gin-gonic/gin"
)

type ServiceProxy struct {
	client  *http.Client
	baseURL string
}

func NewProxy(baseURL string) *ServiceProxy {
	return &ServiceProxy{
		baseURL: baseURL,
		client: &http.Client{
			Timeout: 30 * time.Second,
			Transport: &http.Transport{
				MaxIdleConns:        100,
				MaxIdleConnsPerHost: 20,
				IdleConnTimeout:     90 * time.Second,
			},
		},
	}
}

func (p *ServiceProxy) Handler() gin.HandlerFunc {
	return func(c *gin.Context) {
		p.Forward(c, c.Request.URL.Path)
	}
}

func (p *ServiceProxy) Forward(c *gin.Context, targetPath string) {
	targetURL := fmt.Sprintf("%s%s", p.baseURL, targetPath)
	if c.Request.URL.RawQuery != "" {
		targetURL += "?" + c.Request.URL.RawQuery
	}

	parsedURL, err := url.Parse(targetURL)
	if err != nil {
		c.JSON(http.StatusBadGateway, gin.H{"error": "invalid upstream URL"})
		return
	}

	req, err := http.NewRequestWithContext(c.Request.Context(), c.Request.Method, parsedURL.String(), c.Request.Body)
	if err != nil {
		c.JSON(http.StatusBadGateway, gin.H{"error": "failed to create upstream request"})
		return
	}

	// Copy relevant headers
	for key, vals := range c.Request.Header {
		req.Header[key] = vals
	}
	req.Header.Set("X-Forwarded-For", c.ClientIP())
	req.Header.Set("X-Request-ID", c.GetString("requestID"))

	resp, err := p.client.Do(req)
	if err != nil {
		c.JSON(http.StatusBadGateway, gin.H{"error": "upstream service unavailable"})
		return
	}
	defer resp.Body.Close()

	// Copy response headers
	for key, vals := range resp.Header {
		for _, v := range vals {
			c.Header(key, v)
		}
	}

	c.Status(resp.StatusCode)
	io.Copy(c.Writer, resp.Body)
}
