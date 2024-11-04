import { ArrowRight } from 'lucide-react'

import { Button } from '@/components/ui/button'

interface ButtonOrderStatusProps {
  order: {
    orderId: string
  }
  isLoding: boolean
  status: string
  statusChangeFn: ({ orderId }: { orderId: string }) => void
}

export function ButtonOrderStatus({
  order,
  isLoding,
  status,
  statusChangeFn,
}: ButtonOrderStatusProps) {
  return (
    <Button
      onClick={() => statusChangeFn({ orderId: order.orderId })}
      disabled={isLoding}
      variant={'outline'}
      size={'xs'}
    >
      <ArrowRight className="mr-2 h-3 w-3" />
      <span>{status}</span>
    </Button>
  )
}
