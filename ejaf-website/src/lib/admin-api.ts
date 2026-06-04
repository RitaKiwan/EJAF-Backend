const API_URL = process.env.NEXT_PUBLIC_API_URL || "http://localhost:8000";

// جلب التوكن من localStorage
function getToken(): string | null {
  if (typeof window === "undefined") return null;
  return localStorage.getItem("ejaf_token");
}

function adminHeaders() {
  return {
    "Content-Type": "application/json",
    Authorization: `Bearer ${getToken()}`,
  };
}

// ==================== AUTH ====================

export async function loginAdmin(username: string, password: string) {
  const res = await fetch(`${API_URL}/api/auth/login`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ username, password }),
  });
  const data = await res.json();
  if (!res.ok) throw new Error(data.message || "فشل تسجيل الدخول");

  // نحفظ في localStorage للـ API calls
  localStorage.setItem("ejaf_token", data.token);
  localStorage.setItem("ejaf_user", JSON.stringify(data.user));

  // ونحفظ في cookie للـ middleware
  document.cookie = `ejaf_token=${data.token}; path=/; max-age=86400; SameSite=Strict`;

  return data;
}

export function logoutAdmin() {
  fetch(`${API_URL}/api/auth/logout`, {
    method: "POST",
    headers: adminHeaders(),
  });
  localStorage.removeItem("ejaf_token");
  localStorage.removeItem("ejaf_user");
  // احذف الكوكي
  document.cookie = "ejaf_token=; path=/; max-age=0";
}



export function getAdminUser() {
  if (typeof window === "undefined") return null;
  const u = localStorage.getItem("ejaf_user");
  return u ? JSON.parse(u) : null;
}

export function isLoggedIn(): boolean {
  return !!getToken();
}

// ==================== SERVICES ====================

export async function createService(payload: object) {
  const res = await fetch(`${API_URL}/api/services`, {
    method: "POST",
    headers: adminHeaders(),
    body: JSON.stringify(payload),
  });
  if (!res.ok) throw new Error("فشل إضافة الخدمة");
  return res.json();
}

export async function updateService(id: string, payload: object) {
  const res = await fetch(`${API_URL}/api/services/${id}`, {
    method: "PUT",
    headers: adminHeaders(),
    body: JSON.stringify(payload),
  });
  if (!res.ok) throw new Error("فشل تعديل الخدمة");
  return res.json();
}

export async function deleteService(id: string) {
  const res = await fetch(`${API_URL}/api/services/${id}`, {
    method: "DELETE",
    headers: adminHeaders(),
  });
  if (!res.ok) throw new Error("فشل حذف الخدمة");
  return res.json();
}
export async function uploadFile(file: File): Promise<string> {
  const formData = new FormData();
  formData.append("file", file);

  const res = await fetch(`${API_URL}/api/upload`, {
    method: "POST",
    headers: {
      Authorization: `Bearer ${getToken()}`,
    },
    body: formData,
  });

  if (!res.ok) throw new Error("فشل رفع الصورة");
  const data = await res.json();
  return `${API_URL}${data.url}`;
}

// ==================== PROJECTS ====================

export async function createProject(payload: object) {
  const res = await fetch(`${API_URL}/api/projects`, {
    method: "POST",
    headers: adminHeaders(),
    body: JSON.stringify(payload),
  });
  if (!res.ok) throw new Error("فشل إضافة المشروع");
  return res.json();
}

export async function updateProject(id: string, payload: object) {
  const res = await fetch(`${API_URL}/api/projects/${id}`, {
    method: "PUT",
    headers: adminHeaders(),
    body: JSON.stringify(payload),
  });
  if (!res.ok) throw new Error("فشل تعديل المشروع");
  return res.json();
}

export async function deleteProject(id: string) {
  const res = await fetch(`${API_URL}/api/projects/${id}`, {
    method: "DELETE",
    headers: adminHeaders(),
  });
  if (!res.ok) throw new Error("فشل حذف المشروع");
  return res.json();
}

// ==================== BLOG ====================

export async function createPost(payload: object) {
  const res = await fetch(`${API_URL}/api/blog`, {
    method: "POST",
    headers: adminHeaders(),
    body: JSON.stringify(payload),
  });
  if (!res.ok) throw new Error("فشل إضافة المقال");
  return res.json();
}

export async function updatePost(id: string, payload: object) {
  const res = await fetch(`${API_URL}/api/blog/${id}`, {
    method: "PUT",
    headers: adminHeaders(),
    body: JSON.stringify(payload),
  });
  if (!res.ok) throw new Error("فشل تعديل المقال");
  return res.json();
}

export async function deletePost(id: string) {
  const res = await fetch(`${API_URL}/api/blog/${id}`, {
    method: "DELETE",
    headers: adminHeaders(),
  });
  if (!res.ok) throw new Error("فشل حذف المقال");
  return res.json();
}

// ==================== CONTACT ====================

export async function sendContact(payload: object) {
  const res = await fetch(`${API_URL}/api/contact`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(payload),
  });
  if (!res.ok) throw new Error("فشل إرسال الرسالة");
  return res.json();
}

export async function getContactMessages() {
  const res = await fetch(`${API_URL}/api/contact`, {
    headers: adminHeaders(),
  });
  if (!res.ok) throw new Error("فشل جلب الرسائل");
  return res.json();
}