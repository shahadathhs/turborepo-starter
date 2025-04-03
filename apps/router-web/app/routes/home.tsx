import { Calendar } from '@workspace/ui/components/calendar'
import type { Route } from './+types/home'
import { Button } from '@workspace/ui/components/button'
import { Checkbox } from '@workspace/ui/components/checkbox'

export function meta({}: Route.MetaArgs) {
  return [
    { title: 'New React Router App' },
    { name: 'description', content: 'Welcome to React Router!' },
  ]
}

export default function Home() {
  return (
    <div>
      <Button>Button</Button>
      <Calendar />
      <Checkbox />
    </div>
  )
}
