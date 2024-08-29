/* eslint-disable */
/// <reference types="vite/client" />

import type React from 'react'

declare global {
  var View: React.ReactNode
  function loadView(view: React.ReactNode): void
}
