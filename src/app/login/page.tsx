'use client'

import { startZeroDev } from '@/lib/zero-dev/litProtocol'
import { useEffect } from 'react'

export default function Login() {
  
  /* Option 1 */ 

  // useEffect(() => {
  //   const main = async () => {
  //     const {startZeroDev} = (await import('@/lib/zero-dev/litProtocol'))
  //     startZeroDev()
  //   }
  //   main()
  // }, [])

  /* Option 2 */ 
  useEffect(() => {
    const main = async () => {
      startZeroDev()
    }
    main()
  }, [])

  return (
    <>
      <div className="relative h-full w-full grow">
        <p> Just testing zero dev with lit protocol</p>
      </div>
    </>
  )
}
