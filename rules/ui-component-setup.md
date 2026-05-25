# UI Component Setup

---

## AI Generation Instructions

> **เมื่อถูกขอให้ generate UI component ให้ทำตามขั้นตอนเหล่านี้ทันที — ไม่ต้องถามซ้ำ**

### สิ่งที่ต้อง Output ทุกครั้ง (per component)

สำหรับทุก component ที่ถูกขอ ให้ generate ไฟล์ต่อไปนี้ครบชุด:

```
src/shared/components/ui/<category>/<ComponentName>/
├── <ComponentName>.tsx          ← full implementation
├── <ComponentName>.test.tsx     ← Vitest + React Testing Library
└── index.ts                     ← barrel export
```

### กฎการ Generate Code

1. **Full implementation** — ไม่ใช่แค่ interface เขียน component จริงครบทุก prop
2. **CSS Variables** — ใช้ tokens จาก `src/styles/tokens.css` เท่านั้น (`var(--color-*)`, `var(--space-*)`, ฯลฯ) ห้าม hardcode ค่า
3. **TypeScript strict** — ไม่มี `any`, ทุก prop มี type, export interface ออกด้วย
4. **Accessibility** — ใส่ `aria-label`, `aria-describedby`, `role`, `aria-invalid` ให้ครบตาม WCAG 2.1 AA
5. **Naming** — PascalCase สำหรับ component, camelCase สำหรับ handler (`handleChange`, `handleBlur`)
6. **No external deps** — ใช้แค่ React + CSS variables ห้าม import library UI อื่นเว้นแต่ระบุใน CLAUDE.md
7. **Barrel export** — `index.ts` ต้อง export ทั้ง component และ interface

### Template ที่ต้องใช้

```tsx
// <ComponentName>.tsx
import { type FC } from 'react';
import styles from './<ComponentName>.module.css';  // หรือ inline style ด้วย CSS vars

export interface <ComponentName>Props {
  // ... props ตาม spec ด้านล่าง
}

export const <ComponentName>: FC<<ComponentName>Props> = ({ ... }) => {
  return (
    // JSX ที่สมบูรณ์พร้อม aria-* attributes
  );
};
```

```ts
// index.ts
export { <ComponentName> } from './<ComponentName>';
export type { <ComponentName>Props } from './<ComponentName>';
```

```tsx
// <ComponentName>.test.tsx
import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { describe, it, expect, vi } from 'vitest';
import { <ComponentName> } from './<ComponentName>';

describe('<ComponentName>', () => {
  it('renders correctly', () => { ... });
  it('handles user interaction', async () => { ... });
  it('shows error state', () => { ... });
  it('is accessible', () => { ... });
});
```

### Category → Path Mapping

| Component | Path |
|-----------|------|
| TextInput, NumberInput, TextArea, Select, MultiSelect, Checkbox, RadioGroup, Toggle, DatePicker, FileUpload | `ui/form/` |
| Button | `ui/action/` |
| Toast, Alert, Modal, ConfirmDialog, Drawer | `ui/feedback/` |
| Badge, Avatar, Tooltip, Skeleton, EmptyState, ProgressBar | `ui/display/` |
| Card, PageHeader | `ui/layout/` |
| Table, Pagination | `ui/data/` |

---

## Step 1 — Choose UI Library

เลือก **หนึ่ง** library ก่อนเริ่มโปรเจกต์ แล้วระบุใน `CLAUDE.md` ที่ `[UI_LIBRARY]`

| Library | Install | เหมาะกับ |
|---------|---------|---------|
| **shadcn/ui + Tailwind** | `pnpm dlx shadcn@latest init` | Custom design system, headless |
| **Ant Design (antd)** | `pnpm add antd` | Admin/dashboard, data-heavy |
| **Material UI (MUI)** | `pnpm add @mui/material @emotion/react @emotion/styled` | Google MD3 design |
| **Bootstrap 5** | `pnpm add bootstrap react-bootstrap` | Familiar, rapid prototyping |

---

## Step 2 — Font Configuration

### Option A: Google Fonts (ผ่าน `index.html`)

```html
<!-- index.html -->
<link rel="preconnect" href="https://fonts.googleapis.com" />
<link rel="preconnect" href="https://fonts.gstatic.com" crossorigin />
<link
  href="https://fonts.googleapis.com/css2?family=Inter:wght@300;400;500;600;700&display=swap"
  rel="stylesheet"
/>
```

### Option B: Local Font (ผ่าน CSS)

```css
/* src/styles/fonts.css */
@font-face {
  font-family: 'Inter';
  src: url('/fonts/Inter-Regular.woff2') format('woff2');
  font-weight: 400;
  font-display: swap;
}
```

### ผูก Font กับ Theme

```css
/* src/styles/global.css */
:root {
  --font-sans: 'Inter', ui-sans-serif, system-ui, sans-serif;
  --font-mono: 'JetBrains Mono', ui-monospace, monospace;
}

body {
  font-family: var(--font-sans);
}
```

---

## Step 3 — Design Tokens (CSS Variables)

สร้าง `src/styles/tokens.css` — ใช้เป็น single source of truth สำหรับ color, spacing, radius, shadow

```css
/* src/styles/tokens.css */
:root {
  /* --- Color Palette --- */
  --color-primary-50:  #eff6ff;
  --color-primary-100: #dbeafe;
  --color-primary-500: #3b82f6;
  --color-primary-600: #2563eb;
  --color-primary-700: #1d4ed8;

  --color-success-500: #22c55e;
  --color-warning-500: #f59e0b;
  --color-danger-500:  #ef4444;
  --color-neutral-50:  #f8fafc;
  --color-neutral-100: #f1f5f9;
  --color-neutral-200: #e2e8f0;
  --color-neutral-500: #64748b;
  --color-neutral-700: #334155;
  --color-neutral-900: #0f172a;

  /* --- Semantic Colors --- */
  --color-bg:           var(--color-neutral-50);
  --color-surface:      #ffffff;
  --color-text:         var(--color-neutral-900);
  --color-text-muted:   var(--color-neutral-500);
  --color-border:       var(--color-neutral-200);
  --color-focus-ring:   var(--color-primary-500);

  /* --- Spacing Scale --- */
  --space-1: 0.25rem;   /* 4px  */
  --space-2: 0.5rem;    /* 8px  */
  --space-3: 0.75rem;   /* 12px */
  --space-4: 1rem;      /* 16px */
  --space-5: 1.25rem;   /* 20px */
  --space-6: 1.5rem;    /* 24px */
  --space-8: 2rem;      /* 32px */
  --space-10: 2.5rem;   /* 40px */
  --space-12: 3rem;     /* 48px */

  /* --- Border Radius --- */
  --radius-sm:   0.25rem;
  --radius-md:   0.375rem;
  --radius-lg:   0.5rem;
  --radius-xl:   0.75rem;
  --radius-full: 9999px;

  /* --- Typography Scale --- */
  --text-xs:   0.75rem;
  --text-sm:   0.875rem;
  --text-base: 1rem;
  --text-lg:   1.125rem;
  --text-xl:   1.25rem;
  --text-2xl:  1.5rem;
  --text-3xl:  1.875rem;

  /* --- Font Weight --- */
  --font-normal:   400;
  --font-medium:   500;
  --font-semibold: 600;
  --font-bold:     700;

  /* --- Shadow --- */
  --shadow-sm: 0 1px 2px 0 rgb(0 0 0 / 0.05);
  --shadow-md: 0 4px 6px -1px rgb(0 0 0 / 0.1);
  --shadow-lg: 0 10px 15px -3px rgb(0 0 0 / 0.1);

  /* --- Transition --- */
  --transition-fast:   150ms ease;
  --transition-normal: 250ms ease;
}

/* Dark mode */
@media (prefers-color-scheme: dark) {
  :root {
    --color-bg:         var(--color-neutral-900);
    --color-surface:    var(--color-neutral-700);
    --color-text:       var(--color-neutral-50);
    --color-text-muted: var(--color-neutral-500);
    --color-border:     var(--color-neutral-700);
  }
}
```

---

## Step 4 — Global Styles

```css
/* src/styles/global.css */
@import './tokens.css';
@import './fonts.css';

*, *::before, *::after {
  box-sizing: border-box;
  margin: 0;
  padding: 0;
}

html {
  font-size: 16px;
  scroll-behavior: smooth;
  -webkit-text-size-adjust: 100%;
}

body {
  font-family: var(--font-sans);
  font-size: var(--text-base);
  color: var(--color-text);
  background-color: var(--color-bg);
  line-height: 1.6;
  -webkit-font-smoothing: antialiased;
}

:focus-visible {
  outline: 2px solid var(--color-focus-ring);
  outline-offset: 2px;
}

img, svg, video {
  display: block;
  max-width: 100%;
}

button {
  cursor: pointer;
}
```

---

## Step 5 — Initial Component Checklist

สร้าง component เหล่านี้ใน `src/shared/components/ui/` ทุก component ต้องมี:
- TypeScript props interface
- `aria-*` attributes สำหรับ accessibility
- colocated `.test.tsx`

### Form Components

#### TextInput

```tsx
// src/shared/components/ui/TextInput/TextInput.tsx
interface TextInputProps {
  label: string;
  name: string;
  value: string;
  onChange: (value: string) => void;
  placeholder?: string;
  helperText?: string;
  error?: string;
  disabled?: boolean;
  required?: boolean;
  type?: 'text' | 'email' | 'password' | 'search' | 'url' | 'tel';
}
```

#### NumberInput

```tsx
// src/shared/components/ui/NumberInput/NumberInput.tsx
interface NumberInputProps {
  label: string;
  name: string;
  value: number | '';
  onChange: (value: number | '') => void;
  min?: number;
  max?: number;
  step?: number;
  placeholder?: string;
  helperText?: string;
  error?: string;
  disabled?: boolean;
  required?: boolean;
}
```

#### TextArea

```tsx
interface TextAreaProps {
  label: string;
  name: string;
  value: string;
  onChange: (value: string) => void;
  rows?: number;         // default: 4
  maxLength?: number;
  showCount?: boolean;
  placeholder?: string;
  error?: string;
  disabled?: boolean;
  required?: boolean;
}
```

#### Select

```tsx
interface SelectOption {
  label: string;
  value: string | number;
  disabled?: boolean;
}

interface SelectProps {
  label: string;
  name: string;
  value: string | number | null;
  options: SelectOption[];
  onChange: (value: string | number | null) => void;
  placeholder?: string;
  error?: string;
  disabled?: boolean;
  required?: boolean;
  clearable?: boolean;
}
```

#### MultiSelect

```tsx
interface MultiSelectProps extends Omit<SelectProps, 'value' | 'onChange'> {
  value: (string | number)[];
  onChange: (values: (string | number)[]) => void;
  maxSelected?: number;
}
```

#### Checkbox

```tsx
interface CheckboxProps {
  label: string;
  name: string;
  checked: boolean;
  onChange: (checked: boolean) => void;
  helperText?: string;
  error?: string;
  disabled?: boolean;
  required?: boolean;
  indeterminate?: boolean;
}
```

#### Radio / RadioGroup

```tsx
interface RadioOption {
  label: string;
  value: string;
  disabled?: boolean;
}

interface RadioGroupProps {
  label: string;
  name: string;
  value: string;
  options: RadioOption[];
  onChange: (value: string) => void;
  orientation?: 'horizontal' | 'vertical';
  error?: string;
  required?: boolean;
}
```

#### Toggle (Switch)

```tsx
interface ToggleProps {
  label: string;
  name: string;
  checked: boolean;
  onChange: (checked: boolean) => void;
  size?: 'sm' | 'md' | 'lg';
  disabled?: boolean;
  labelPosition?: 'left' | 'right';
}
```

#### DatePicker

```tsx
interface DatePickerProps {
  label: string;
  name: string;
  value: Date | null;
  onChange: (date: Date | null) => void;
  min?: Date;
  max?: Date;
  placeholder?: string;
  error?: string;
  disabled?: boolean;
  required?: boolean;
  format?: string;           // default: 'DD/MM/YYYY'
}
```

#### FileUpload

```tsx
interface FileUploadProps {
  label: string;
  name: string;
  accept?: string;           // e.g. 'image/*,.pdf'
  multiple?: boolean;
  maxSize?: number;          // bytes
  maxFiles?: number;
  onUpload: (files: File[]) => void;
  error?: string;
  disabled?: boolean;
  dragAndDrop?: boolean;     // default: true
}
```

---

### Button

```tsx
interface ButtonProps {
  children: React.ReactNode;
  variant?: 'primary' | 'secondary' | 'danger' | 'ghost' | 'link';
  size?: 'sm' | 'md' | 'lg';
  type?: 'button' | 'submit' | 'reset';
  loading?: boolean;
  disabled?: boolean;
  fullWidth?: boolean;
  leftIcon?: React.ReactNode;
  rightIcon?: React.ReactNode;
  onClick?: () => void;
}
```

---

### Feedback & Overlay Components

#### Toast / Notification

```tsx
type ToastType = 'success' | 'error' | 'warning' | 'info';

interface ToastOptions {
  message: string;
  type: ToastType;
  duration?: number;   // ms, default: 3000
  description?: string;
}

// Usage via hook
const { toast } = useToast();
toast({ type: 'success', message: 'Saved!' });
```

#### Alert / Banner

```tsx
interface AlertProps {
  type: 'success' | 'error' | 'warning' | 'info';
  title?: string;
  message: string;
  dismissible?: boolean;
  onDismiss?: () => void;
  action?: { label: string; onClick: () => void };
}
```

#### Modal / Dialog

```tsx
interface ModalProps {
  isOpen: boolean;
  onClose: () => void;
  title?: string;
  children: React.ReactNode;
  size?: 'sm' | 'md' | 'lg' | 'xl' | 'full';
  closeOnBackdrop?: boolean;  // default: true
  showCloseButton?: boolean;  // default: true
  footer?: React.ReactNode;
}
```

#### ConfirmDialog

```tsx
interface ConfirmDialogProps {
  isOpen: boolean;
  title: string;
  message: string;
  confirmLabel?: string;   // default: 'Confirm'
  cancelLabel?: string;    // default: 'Cancel'
  variant?: 'danger' | 'primary';
  onConfirm: () => void | Promise<void>;
  onCancel: () => void;
}
```

#### Drawer

```tsx
interface DrawerProps {
  isOpen: boolean;
  onClose: () => void;
  title?: string;
  children: React.ReactNode;
  placement?: 'left' | 'right' | 'top' | 'bottom';
  size?: 'sm' | 'md' | 'lg';
}
```

---

### Display Components

#### Badge / Tag

```tsx
interface BadgeProps {
  label: string;
  variant?: 'default' | 'primary' | 'success' | 'warning' | 'danger';
  size?: 'sm' | 'md';
  dot?: boolean;
  removable?: boolean;
  onRemove?: () => void;
}
```

#### Avatar

```tsx
interface AvatarProps {
  src?: string;
  alt?: string;
  name?: string;         // fallback initials
  size?: 'xs' | 'sm' | 'md' | 'lg' | 'xl';
  shape?: 'circle' | 'square';
  status?: 'online' | 'offline' | 'busy' | 'away';
}
```

#### Tooltip

```tsx
interface TooltipProps {
  content: string;
  children: React.ReactElement;
  placement?: 'top' | 'bottom' | 'left' | 'right';
  delay?: number;
}
```

#### Skeleton (Loading Placeholder)

```tsx
interface SkeletonProps {
  variant?: 'text' | 'rectangle' | 'circle';
  width?: string | number;
  height?: string | number;
  lines?: number;        // for variant='text'
  animate?: boolean;     // default: true
}
```

#### Empty State

```tsx
interface EmptyStateProps {
  icon?: React.ReactNode;
  title: string;
  description?: string;
  action?: { label: string; onClick: () => void };
}
```

#### ProgressBar

```tsx
interface ProgressBarProps {
  value: number;           // 0–100
  max?: number;            // default: 100
  variant?: 'primary' | 'success' | 'warning' | 'danger';
  size?: 'sm' | 'md' | 'lg';
  showLabel?: boolean;
  striped?: boolean;
  animated?: boolean;
}
```

---

### Layout Components

#### Card

```tsx
interface CardProps {
  children: React.ReactNode;
  title?: string;
  subtitle?: string;
  footer?: React.ReactNode;
  headerAction?: React.ReactNode;
  padding?: 'none' | 'sm' | 'md' | 'lg';
  shadow?: 'none' | 'sm' | 'md' | 'lg';
  bordered?: boolean;
}
```

#### PageHeader

```tsx
interface PageHeaderProps {
  title: string;
  subtitle?: string;
  breadcrumbs?: { label: string; href?: string }[];
  actions?: React.ReactNode;
  backHref?: string;
}
```

---

### Data Display

#### Table

```tsx
interface Column<T> {
  key: keyof T | string;
  title: string;
  width?: number | string;
  sortable?: boolean;
  render?: (value: unknown, row: T, index: number) => React.ReactNode;
}

interface TableProps<T> {
  columns: Column<T>[];
  data: T[];
  loading?: boolean;
  rowKey: keyof T;
  pagination?: {
    page: number;
    pageSize: number;
    total: number;
    onChange: (page: number, pageSize: number) => void;
  };
  onRowClick?: (row: T) => void;
  emptyText?: string;
}
```

#### Pagination

```tsx
interface PaginationProps {
  page: number;
  pageSize: number;
  total: number;
  onChange: (page: number, pageSize: number) => void;
  pageSizeOptions?: number[];   // default: [10, 20, 50, 100]
  showTotal?: boolean;
}
```

---

## File Structure Summary

```
src/shared/components/ui/
├── form/
│   ├── TextInput/
│   ├── NumberInput/
│   ├── TextArea/
│   ├── Select/
│   ├── MultiSelect/
│   ├── Checkbox/
│   ├── RadioGroup/
│   ├── Toggle/
│   ├── DatePicker/
│   └── FileUpload/
├── action/
│   └── Button/
├── feedback/
│   ├── Toast/            # + useToast hook
│   ├── Alert/
│   ├── Modal/
│   ├── ConfirmDialog/
│   └── Drawer/
├── display/
│   ├── Badge/
│   ├── Avatar/
│   ├── Tooltip/
│   ├── Skeleton/
│   ├── EmptyState/
│   └── ProgressBar/
├── layout/
│   ├── Card/
│   └── PageHeader/
└── data/
    ├── Table/
    └── Pagination/
```
