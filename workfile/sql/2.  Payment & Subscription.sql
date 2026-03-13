-- 2.   PAYMENT & SUBSCRIPTION SERVICE

-- Table: subscription_plans
CREATE TABLE subscription_plans (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    name VARCHAR(100) UNIQUE NOT NULL, -- e.g., 'Mobile', 'Premium'
    price_inr DECIMAL(10,2) NOT NULL,
    billing_cycle VARCHAR(20) CHECK (billing_cycle IN ('monthly','quarterly','yearly')),
    max_screens SMALLINT DEFAULT 1,
    max_resolution VARCHAR(10) DEFAULT '720p',
    has_downloads BOOLEAN DEFAULT false,
    has_dolby BOOLEAN DEFAULT false,
    is_active BOOLEAN DEFAULT true,
    created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Table: user_subscriptions
CREATE TABLE user_subscriptions (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id UUID REFERENCES users(id) ON DELETE CASCADE,
    plan_id UUID REFERENCES subscription_plans(id),
    status VARCHAR(20) CHECK (status IN ('active','expired','cancelled','trial')),
    started_at TIMESTAMPTZ NOT NULL,
    expires_at TIMESTAMPTZ NOT NULL,
    auto_renew BOOLEAN DEFAULT true,
    cancelled_at TIMESTAMPTZ,
    created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Index for cron jobs to find expired subscriptions quickly
CREATE INDEX idx_sub_expiry ON user_subscriptions(expires_at) WHERE status = 'active';


-- Table: payments
CREATE TABLE payments (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id UUID REFERENCES users(id) ON DELETE CASCADE,
    subscription_id UUID REFERENCES user_subscriptions(id),
    amount_inr DECIMAL(10,2) NOT NULL,
    currency CHAR(3) DEFAULT 'INR',
    payment_method VARCHAR(30), -- e.g., 'UPI', 'card'
    gateway VARCHAR(30), -- e.g., 'razorpay'
    gateway_txn_id VARCHAR(255) UNIQUE,
    status VARCHAR(20) CHECK (status IN ('pending','success','failed','refunded')),
    paid_at TIMESTAMPTZ,
    created_at TIMESTAMPTZ DEFAULT NOW()
);