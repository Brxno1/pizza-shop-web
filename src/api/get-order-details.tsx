import { api } from '@/lib/axios'

interface GetOrderDetailsResponse {
  orderId: string
}

interface GetOrderDetailsResponseData {
  id: string
  createdAt: string
  status: 'pending' | 'canceled' | 'processing' | 'delivering' | 'delivered'
  totalInCents: number
  customer: {
    name: string
    email: string
    phone: string | null
  }
  orderItems: {
    id: string
    priceInCents: number
    quantity: number
    product: {
      name: string
    }
  }[]
}

export async function getOrderDetails({ orderId }: GetOrderDetailsResponse) {
  const response = await api.get<GetOrderDetailsResponseData>(
    `/orders/${orderId}`,
  )

  return response.data
}
