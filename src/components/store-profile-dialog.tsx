import { zodResolver } from '@hookform/resolvers/zod'
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query'
import { useForm } from 'react-hook-form'
import { toast } from 'sonner'
import { z } from 'zod'

import {
  getManagedRestaurant,
  GetManagedRestaurantResponse,
} from '@/api/get-managed-restaurant'
import { updateProfile } from '@/api/update-profile'

import { Button } from './ui/button'
import {
  DialogClose,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from './ui/dialog'
import { Input } from './ui/input'
import { Label } from './ui/label'
import { Textarea } from './ui/textarea'

const storeProfileFormSchema = z.object({
  name: z.string().min(2).max(50),
  description: z.string().default(''),
})

type StoreProfileInput = z.infer<typeof storeProfileFormSchema>

export function StoreProfileDialog() {
  const queryClient = useQueryClient()

  const { data: managedRestaurant } = useQuery({
    queryKey: ['managed-restaurant'],
    queryFn: getManagedRestaurant,
    staleTime: Infinity,
  })

  function updatedManagedRestaurantCache({
    name,
    description,
  }: StoreProfileInput) {
    const cached = queryClient.getQueryData<GetManagedRestaurantResponse>([
      'managed-restaurant',
    ])

    if (cached) {
      queryClient.setQueryData<GetManagedRestaurantResponse>(
        ['managed-restaurant'],
        {
          ...cached,
          name,
          description,
        },
      )
    }

    return { cached }
  }

  const { mutateAsync: updateProfileFn } = useMutation({
    mutationFn: updateProfile,
    onMutate({ name, description }) {
      const { cached } = updatedManagedRestaurantCache({ name, description })

      return { previousProfile: cached }
    },
    onError(_error, _variables, context) {
      if (context?.previousProfile) {
        const { name, description } = context.previousProfile

        if (description !== null) {
          updatedManagedRestaurantCache({ name, description })
        }
      }
    },
  })

  const {
    register,
    handleSubmit,
    formState: { isSubmitting },
  } = useForm<StoreProfileInput>({
    values: {
      name: managedRestaurant?.name || '',
      description: managedRestaurant?.description || '',
    },
    resolver: zodResolver(storeProfileFormSchema),
  })

  async function handleUpdateProfile({ name, description }: StoreProfileInput) {
    try {
      await updateProfileFn({
        name,
        description,
      })

      toast.success('Perfil atualizado com sucesso!')
    } catch {
      toast.error('Ocorreu um erro ao editar seu perfil, tente novamente!')
    }
  }

  return (
    <>
      <DialogHeader>
        <DialogTitle>Perfil da loja</DialogTitle>
        <DialogDescription>Edite as informações da sua loja</DialogDescription>
      </DialogHeader>

      <form onSubmit={handleSubmit(handleUpdateProfile)}>
        <div className="space-y-4 py-4">
          <div className="grid grid-cols-4 items-center gap-4">
            <Label htmlFor="name" className="text-right">
              Nome
            </Label>
            <Input id="name" {...register('name')} className="col-span-3" />
          </div>

          <div className="grid grid-cols-4 items-center gap-4">
            <Label htmlFor="description" className="text-right">
              Descrição
            </Label>
            <Textarea
              id="description"
              {...register('description')}
              className="col-span-3"
            />
          </div>
        </div>

        <DialogFooter className="m-auto flex w-[65%] items-center justify-between gap-12">
          <DialogClose asChild>
            <Button
              variant={'ghost'}
              type="button"
              className="hover:bg-rose-500 dark:hover:bg-rose-600"
            >
              Cancelar
            </Button>
          </DialogClose>
          <Button type="submit" variant={'success'} disabled={isSubmitting}>
            Salvar
          </Button>
        </DialogFooter>
      </form>
    </>
  )
}
