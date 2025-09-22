import React, { Suspense } from 'react'
import TTSClient from './TTSClient'

export default function Page() {
  return (
    <Suspense fallback={<div />}>
      <TTSClient />
    </Suspense>
  )
}
