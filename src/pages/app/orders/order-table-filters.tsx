import { zodResolver } from '@hookform/resolvers/zod'
import { Search, X } from 'lucide-react'
import { Controller, useForm } from 'react-hook-form'
import { useSearchParams } from 'react-router-dom'
import { z } from 'zod'

import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'

const orderFilterSchema = z.object({
  orderId: z.string().optional(),
  customerName: z.string().optional(),
  status: z.string().optional(),
})

type OrderFilterSchema = z.infer<typeof orderFilterSchema>

export function OrderTableFilters() {
  const [searchParams, setSearchParams] = useSearchParams()

  const orderid = searchParams.get('orderId')
  const customerName = searchParams.get('customerName')
  const status = searchParams.get('status')

  const { register, handleSubmit, control, reset } = useForm<OrderFilterSchema>(
    {
      defaultValues: {
        orderId: orderid || '',
        customerName: customerName || '',
        status: status || 'all',
      },
      resolver: zodResolver(orderFilterSchema),
    },
  )

  function handleFilter({ orderId, customerName, status }: OrderFilterSchema) {
    setSearchParams((state) => {
      if (orderId) {
        state.set('orderId', orderId)
      } else {
        state.delete('orderId')
      }
      if (customerName) {
        state.set('customerName', customerName)
      } else {
        state.delete('customerName')
      }
      if (status) {
        state.set('status', status)
      } else {
        state.delete('status')
      }
      state.set('page', '1')

      return state
    })
  }

  function handleClearFilters() {
    setSearchParams((state) => {
      state.delete('orderId')
      state.delete('customerName')
      state.delete('status')
      state.set('page', '1')

      return state
    })

    reset({
      orderId: '',
      customerName: '',
      status: 'all',
    })
  }

  return (
    <form
      onSubmit={handleSubmit(handleFilter)}
      className="flex items-center gap-2"
    >
      <span className="text-sm font-semibold">Filtros:</span>
      <Input
        {...register('orderId')}
        placeholder="ID do pedido"
        className="h-8 w-auto"
      />
      <Input
        {...register('customerName')}
        placeholder="Nome do cliente"
        className="h-8 w-[320px]"
      />

      <Controller
        control={control}
        name="status"
        render={({ field: { name, value, disabled, onChange } }) => (
          <Select
            defaultValue={'all'}
            name={name}
            value={value}
            disabled={disabled}
            onValueChange={onChange}
          >
            <SelectTrigger className="h-8 w-[180px]">
              <SelectValue />
            </SelectTrigger>

            <SelectContent>
              <SelectItem value="all">Todos</SelectItem>
              <SelectItem value="pending">Pendente</SelectItem>
              <SelectItem value="canceled">Cancelado</SelectItem>
              <SelectItem value="processing">Em preparo</SelectItem>
              <SelectItem value="delivering">Em entrega</SelectItem>
              <SelectItem value="delivered">Entregue</SelectItem>
            </SelectContent>
          </Select>
        )}
      ></Controller>

      <Button type="submit" variant={'secondary'} size={'xs'}>
        <Search className="mr-2 h-4 w-4" />
        <span>Filtrar resultados</span>
      </Button>

      <Button
        type="button"
        variant={'outline'}
        size={'xs'}
        onClick={handleClearFilters}
      >
        <X className="mr-2 h-4 w-4" />
        <span>Remover filtros</span>
      </Button>
    </form>
  )
}
