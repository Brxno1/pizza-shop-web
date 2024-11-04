import { useMutation, useQueryClient } from '@tanstack/react-query'
import { formatDistanceToNow } from 'date-fns'
import { ptBR } from 'date-fns/locale'
import { Search, X } from 'lucide-react'
import { useState } from 'react'

import { approveOrder } from '@/api/approve-order'
import { cancelOrder } from '@/api/cancel-order'
import { deliverOrder } from '@/api/deliver-order'
import { dispatchOrder } from '@/api/dispatch-order'
import { GetOrdersResponse } from '@/api/get-orders'
import { OrderStatus, OrderStatusType } from '@/components/order-status'
import { Button } from '@/components/ui/button'
import { Dialog, DialogContent, DialogTrigger } from '@/components/ui/dialog'
import { TableCell, TableRow } from '@/components/ui/table'
import { OrderDetails } from '@/pages/app/orders/order-details'

import { ButtonOrderStatus } from './button-order-status'

interface OrderTableRowProps {
  order: {
    orderId: string
    createdAt: string
    status: 'pending' | 'canceled' | 'processing' | 'delivering' | 'delivered'
    customerName: string
    total: number
  }
}

interface StatusConfig {
  isLoading: boolean
  statusText: string
  statusChangeFn: (params: { orderId: string }) => Promise<void>
}

export function OrderTableRow({ order }: OrderTableRowProps) {
  const [isDetailsOpen, setIsDetailsOpen] = useState(false)
  const queryClient = useQueryClient()

  function updateOrderStatusOnCache(orderId: string, status: OrderStatusType) {
    const ordersListCache = queryClient.getQueriesData<GetOrdersResponse>({
      queryKey: ['orders'],
    })

    ordersListCache.forEach(([cacheKey, cacheData]) => {
      if (!cacheData) {
        return
      }

      queryClient.setQueryData<GetOrdersResponse>(cacheKey, {
        ...cacheData,
        orders: cacheData.orders.map((order) => {
          if (order.orderId === orderId) {
            return { ...order, status }
          }
          return order
        }),
      })
    })
  }

  const { mutateAsync: approveOrderFn, isPending: isApprovingOrder } =
    useMutation({
      mutationFn: approveOrder,
      onSuccess: (_data, { orderId }) => {
        updateOrderStatusOnCache(orderId, 'processing')
      },
    })

  const { mutateAsync: cancelOrderFn, isPending: isCancelingOrder } =
    useMutation({
      mutationFn: cancelOrder,
      onSuccess: (_data, { orderId }) => {
        updateOrderStatusOnCache(orderId, 'canceled')
      },
    })

  const { mutateAsync: dispatchOrderFn, isPending: isDispatchingOrder } =
    useMutation({
      mutationFn: dispatchOrder,
      onSuccess: (_data, { orderId }) => {
        updateOrderStatusOnCache(orderId, 'delivering')
      },
    })

  const { mutateAsync: deliverOrderFn, isPending: isDeliveringOrder } =
    useMutation({
      mutationFn: deliverOrder,
      onSuccess: (_data, { orderId }) => {
        updateOrderStatusOnCache(orderId, 'delivered')
      },
    })

  const statusMap: Record<
    'pending' | 'processing' | 'delivering',
    StatusConfig
  > = {
    pending: {
      isLoading: isApprovingOrder,
      statusText: 'Aprovar',
      statusChangeFn: approveOrderFn,
    },
    processing: {
      isLoading: isDispatchingOrder,
      statusText: 'Em entrega',
      statusChangeFn: dispatchOrderFn,
    },
    delivering: {
      isLoading: isDeliveringOrder,
      statusText: 'Entregue',
      statusChangeFn: deliverOrderFn,
    },
  }

  const { status } = order
  const statusConfig = statusMap[status as keyof typeof statusMap]

  return (
    <TableRow>
      <TableCell>
        <Dialog open={isDetailsOpen} onOpenChange={setIsDetailsOpen}>
          <DialogTrigger asChild>
            <Button variant={'outline'} size="xs">
              <Search className="h-3 w-3" />
              <span className="sr-only">Detalhes do pedido</span>
            </Button>
          </DialogTrigger>

          <DialogContent>
            <OrderDetails orderId={order.orderId} open={isDetailsOpen} />
          </DialogContent>
        </Dialog>
      </TableCell>
      <TableCell className="font-mono text-xs font-medium text-muted-foreground">
        {order.orderId}
      </TableCell>
      <TableCell className="text-muted-foreground">
        {formatDistanceToNow(new Date(order.createdAt), {
          locale: ptBR,
          addSuffix: true,
        })}
      </TableCell>
      <TableCell>
        <OrderStatus status={order.status} />
      </TableCell>
      <TableCell className="font-medium">{order.customerName}</TableCell>
      <TableCell className="font-medium">
        {new Intl.NumberFormat('pt-BR', {
          style: 'currency',
          currency: 'BRL',
        }).format(order.total / 100)}
      </TableCell>
      <TableCell>
        {statusConfig && (
          <ButtonOrderStatus
            order={order}
            isLoding={statusConfig.isLoading}
            status={statusConfig.statusText}
            statusChangeFn={statusConfig.statusChangeFn}
          />
        )}
      </TableCell>
      <TableCell>
        <Button
          onClick={() => cancelOrderFn({ orderId: order.orderId })}
          disabled={
            !['pending', 'processing'].includes(order.status) ||
            isCancelingOrder
          }
          variant={'ghost'}
          size={'xs'}
        >
          <X className="mr-2 h-3 w-3" />
          <span>Cancelar</span>
        </Button>
      </TableCell>
    </TableRow>
  )
}
