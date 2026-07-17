import React from 'react';
import { render } from '@testing-library/react';
import { MemoryRouter, Routes, Route } from 'react-router-dom';
import { AdminAuthGuard } from '../../src/guards/AdminAuthGuard';
import { createSession, persistSession, clearSession } from '../../src/services/admin-auth';

describe('AdminAuthGuard (宪法 §6.8 最小加固)', () => {
  beforeEach(() => {
    clearSession();
  });

  test('未登录访问 /admin 重定向到 /admin/login', () => {
    const { container } = render(
      <MemoryRouter initialEntries={['/admin']}>
        <Routes>
          <Route path="/admin/login" element={<div>LOGIN_PAGE</div>} />
          <Route path="/admin" element={<AdminAuthGuard><div>ADMIN_PAGE</div></AdminAuthGuard>} />
        </Routes>
      </MemoryRouter>
    );
    expect(container.textContent).toBe('LOGIN_PAGE');
  });

  test('已登录访问 /admin 通过（未过期）', () => {
    persistSession(createSession());
    const { container } = render(
      <MemoryRouter initialEntries={['/admin']}>
        <Routes>
          <Route path="/admin/login" element={<div>LOGIN_PAGE</div>} />
          <Route path="/admin" element={<AdminAuthGuard><div>ADMIN_PAGE</div></AdminAuthGuard>} />
        </Routes>
      </MemoryRouter>
    );
    expect(container.textContent).toBe('ADMIN_PAGE');
  });

  test('过期 session 跳 /admin/login', () => {
    const s = createSession();
    s.expiresAt = Date.now() - 1000;
    persistSession(s);
    const { container } = render(
      <MemoryRouter initialEntries={['/admin']}>
        <Routes>
          <Route path="/admin/login" element={<div>LOGIN_PAGE</div>} />
          <Route path="/admin" element={<AdminAuthGuard><div>ADMIN_PAGE</div></AdminAuthGuard>} />
        </Routes>
      </MemoryRouter>
    );
    expect(container.textContent).toBe('LOGIN_PAGE');
  });

  test('损坏 JSON session 跳 /admin/login', () => {
    if (typeof window !== 'undefined') {
      window.localStorage.setItem('gift_pilot_web:admin-session', '{bad json');
    }
    const { container } = render(
      <MemoryRouter initialEntries={['/admin']}>
        <Routes>
          <Route path="/admin/login" element={<div>LOGIN_PAGE</div>} />
          <Route path="/admin" element={<AdminAuthGuard><div>ADMIN_PAGE</div></AdminAuthGuard>} />
        </Routes>
      </MemoryRouter>
    );
    expect(container.textContent).toBe('LOGIN_PAGE');
  });
});
