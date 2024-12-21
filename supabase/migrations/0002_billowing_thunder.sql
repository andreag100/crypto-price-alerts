/*
  # Add email preferences and notification settings

  1. New Columns
    - Add `email_notifications` to crypto_alerts table
      - Boolean flag to enable/disable email notifications per alert

  2. Changes
    - Update existing alerts to have email notifications enabled by default
*/

ALTER TABLE crypto_alerts
ADD COLUMN IF NOT EXISTS email_notifications boolean DEFAULT true;

-- Update existing records to have email notifications enabled
UPDATE crypto_alerts
SET email_notifications = true
WHERE email_notifications IS NULL;
