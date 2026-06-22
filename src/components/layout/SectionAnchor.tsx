type SectionAnchorProps = {
  id: string
  children: React.ReactNode
}

export function SectionAnchor({ id, children }: SectionAnchorProps) {
  return (
    <div id={id} className="scroll-mt-36 md:scroll-mt-32">
      {children}
    </div>
  )
}
