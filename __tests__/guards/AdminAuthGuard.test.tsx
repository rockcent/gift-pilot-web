import React from 'react';
import { render } from '@testing-library/react';
import { MemoryRouter, Routes, Route } from 'react-router-dom';
import { AdminAuthGuard } from '../../src/guards/AdminAuthGuard';

describe('AdminAuthGuard', () => {
  beforeEach(() => {
    if (typeof localStorage !== 'undefined') localStorage.clear();
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

  test('已登录访问 /admin 通过', () => {
    localStorage.setItem('gp-admin-session', JSON.stringify({ loginAt: Date.now() }));
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
});
