// /api/admin/approvals — alias for /api/admin/approve
// This route exists for forward compatibility with audit spec.
// All logic is handled in /api/admin/approve/route.ts

export { POST } from '@/app/api/admin/approve/route'
