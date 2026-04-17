-- Seed Test Accounts (Fixed Version)
-- IMPORTANT: Run this script ONLY AFTER running fix_registration.sql
-- The handle_new_user() trigger will automatically populate the public.profiles table.

-- 1. Ensure pgcrypto is enabled (for crypt function)
CREATE EXTENSION IF NOT EXISTS pgcrypto;

-- 2. Insert test users into auth.users safely using a DO block
DO $$
BEGIN
  -- Startup User
  IF NOT EXISTS (SELECT 1 FROM auth.users WHERE email = 'test1@inunity.in') THEN
    INSERT INTO auth.users (
      instance_id,
      id,
      aud,
      role,
      email,
      encrypted_password,
      email_confirmed_at,
      recovery_sent_at,
      last_sign_in_at,
      raw_app_meta_data,
      raw_user_meta_data,
      created_at,
      updated_at,
      confirmation_token,
      email_change,
      email_change_token_new,
      recovery_token
    )
    VALUES (
      '00000000-0000-0000-0000-000000000000',
      uuid_generate_v4(),
      'authenticated',
      'authenticated',
      'test1@inunity.in',
      crypt('Test@1234', gen_salt('bf')),
      now(),
      now(),
      now(),
      '{"provider":"email","providers":["email"]}',
      '{"full_name":"Test Startup","startup_name":"InUnity Startup","role":"startup"}',
      now(),
      now(),
      '',
      '',
      '',
      ''
    );
  END IF;

  -- Programme Team User
  IF NOT EXISTS (SELECT 1 FROM auth.users WHERE email = 'test2@inunity.in') THEN
    INSERT INTO auth.users (
      instance_id,
      id,
      aud,
      role,
      email,
      encrypted_password,
      email_confirmed_at,
      recovery_sent_at,
      last_sign_in_at,
      raw_app_meta_data,
      raw_user_meta_data,
      created_at,
      updated_at,
      confirmation_token,
      email_change,
      email_change_token_new,
      recovery_token
    )
    VALUES (
      '00000000-0000-0000-0000-000000000000',
      uuid_generate_v4(),
      'authenticated',
      'authenticated',
      'test2@inunity.in',
      crypt('Test@1234', gen_salt('bf')),
      now(),
      now(),
      now(),
      '{"provider":"email","providers":["email"]}',
      '{"full_name":"Test Program","startup_name":"InUnity Team","role":"programme_team"}',
      now(),
      now(),
      '',
      '',
      '',
      ''
    );
  END IF;

  -- Admin User
  IF NOT EXISTS (SELECT 1 FROM auth.users WHERE email = 'admin1@inunity.in') THEN
    INSERT INTO auth.users (
      instance_id,
      id,
      aud,
      role,
      email,
      encrypted_password,
      email_confirmed_at,
      recovery_sent_at,
      last_sign_in_at,
      raw_app_meta_data,
      raw_user_meta_data,
      created_at,
      updated_at,
      confirmation_token,
      email_change,
      email_change_token_new,
      recovery_token
    )
    VALUES (
      '00000000-0000-0000-0000-000000000000',
      uuid_generate_v4(),
      'authenticated',
      'authenticated',
      'admin1@inunity.in',
      crypt('Test@1234', gen_salt('bf')),
      now(),
      now(),
      now(),
      '{"provider":"email","providers":["email"]}',
      '{"full_name":"Test Admin","startup_name":"InUnity Central","role":"admin"}',
      now(),
      now(),
      '',
      '',
      '',
      ''
    );
  END IF;
END $$;
