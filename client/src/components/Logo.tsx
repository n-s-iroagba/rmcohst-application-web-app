'use client'

import React from 'react'
import Image from 'next/image'

interface LogoProps {
  className?: string
  src?: string
  alt?: string
  width?: number
  height?: number
}

const Logo: React.FC<LogoProps> = ({
  className = '',
  src = '/images/palm-tree-vertical.png', // default path, update as needed
  alt = 'Palm tree logo',
  width = 40,
  height = 80
}) => {
  return (
    <div className={className} style={{ width, height, position: 'relative' }}>
      <Image src={src} alt={alt} layout="fill" objectFit="contain" priority />
    </div>
  )
}

export default Logo
