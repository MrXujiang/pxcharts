import * as React from "react"
import NextLink from "next/link"
import { cn } from "@/lib/utils"

interface LinkProps extends React.AnchorHTMLAttributes<HTMLAnchorElement> {
  href: string
  children: React.ReactNode
  className?: string
}

const Link = React.forwardRef<HTMLAnchorElement, LinkProps>(({ href, children, className, ...props }, ref) => {
  // 检查是否是外部链接
  const isExternal = href.startsWith("http") || href.startsWith("mailto:") || href.startsWith("tel:")

  if (isExternal) {
    return (
      <a ref={ref} href={href} className={className} target="_blank" rel="noopener noreferrer" {...props}>
        {children}
      </a>
    )
  }

  return (
    <NextLink href={href} passHref legacyBehavior>
      <a ref={ref} className={cn(className)} {...props}>
        {children}
      </a>
    </NextLink>
  )
})

Link.displayName = "Link"

export { Link }
