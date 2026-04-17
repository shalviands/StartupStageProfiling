# Test Credentials - Strategic Profiler

Use these credentials to test the different role-based views in the application.

> [!IMPORTANT]
> **Setup Required**: These accounts will only work after you run the `seed_test_accounts.sql` script in your Supabase SQL Editor.

| Email | Password | Role | Description |
| :--- | :--- | :--- | :--- |
| `test1@inunity.in` | `Test@1234` | **Startup** | View the diagnostic profiler and your own session history. |
| `test2@inunity.in` | `Test@1234` | **Programme Team** | Audit startups and manage diagnostic sessions. |
| `admin1@inunity.in` | `Test@1234` | **Admin** | Full system access, users, and platform settings. |

---

## How to use these accounts
1. Go to the [Login Page](http://localhost:3000/login).
2. Enter the email and password from the table above.
3. You should be redirected to the appropriate dashboard based on your role.

## Future Testing
Save this file in your records. If you need to reset these accounts, you can re-run the `seed_test_accounts.sql` script.
