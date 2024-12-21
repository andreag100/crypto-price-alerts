/*
  # Crypto Price Alerts System

  1. New Tables
    - `crypto_alerts`
      - `id` (uuid, primary key)
      - `user_id` (uuid, references auth.users)
      - `crypto_symbol` (text, e.g., 'BTC', 'ETH')
      - `target_price` (numeric)
      - `alert_type` (text, either 'above' or 'below')
      - `is_active` (boolean)
      - `created_at` (timestamp)
      - `updated_at` (timestamp)

  2. Security
    - Enable RLS on crypto_alerts table
    - Add policies for CRUD operations
*/

CREATE TABLE crypto_alerts (
    id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id uuid REFERENCES auth.users NOT NULL,
    crypto_symbol text NOT NULL,
    target_price numeric NOT NULL,
    alert_type text NOT NULL CHECK (alert_type IN ('above', 'below')),
    is_active boolean DEFAULT true,
    created_at timestamptz DEFAULT now(),
    updated_at timestamptz DEFAULT now()
);

ALTER TABLE crypto_alerts ENABLE ROW LEVEL SECURITY;

-- Policy: Users can read their own alerts
CREATE POLICY "Users can view own alerts" ON crypto_alerts
    FOR SELECT
    TO authenticated
    USING (auth.uid() = user_id);

-- Policy: Users can create their own alerts
CREATE POLICY "Users can create alerts" ON crypto_alerts
    FOR INSERT
    TO authenticated
    WITH CHECK (auth.uid() = user_id);

-- Policy: Users can update their own alerts
CREATE POLICY "Users can update own alerts" ON crypto_alerts
    FOR UPDATE
    TO authenticated
    USING (auth.uid() = user_id)
    WITH CHECK (auth.uid() = user_id);

-- Policy: Users can delete their own alerts
CREATE POLICY "Users can delete own alerts" ON crypto_alerts
    FOR DELETE
    TO authenticated
    USING (auth.uid() = user_id);