import Image from 'next/image'
import React from 'react'
import logo  from '@/assets/logo.png';


function Logo() {
  return (
    <Image width={100} height={100} src={logo} alt="logo" style={{height:'auto', width:'auto'}} />
  )
}
export default Logo
