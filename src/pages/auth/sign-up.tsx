import { zodResolver } from '@hookform/resolvers/zod'
import { useMutation } from '@tanstack/react-query'
import { Helmet } from 'react-helmet-async'
import { useForm } from 'react-hook-form'
import { Link, useNavigate } from 'react-router-dom'
import { toast } from 'sonner'
import { z } from 'zod'

import { registerRestaurant } from '@/api/register-restaurant'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'

const signUpFormSchema = z.object({
  restaurantName: z.string(),
  managerName: z.string(),
  email: z.string().email(),
  phone: z.string(),
})

type signUpForm = z.infer<typeof signUpFormSchema>

export function SignUp() {
  const navigate = useNavigate()

  const { mutateAsync: registerRestaurantFn } = useMutation({
    mutationFn: registerRestaurant,
  })

  const {
    register,
    handleSubmit,
    reset,
    formState: { isSubmitting },
  } = useForm<signUpForm>({
    resolver: zodResolver(signUpFormSchema),
    defaultValues: {
      email: '',
    },
  })

  async function handleSigUp(data: signUpForm) {
    try {
      await registerRestaurantFn({
        restaurantName: data.restaurantName,
        managerName: data.managerName,
        email: data.email,
        phone: data.phone,
      })
      toast.success('Restaurante cadastrado com sucesso!', {
        action: {
          label: 'Login',
          onClick: () => navigate(`/sign-in?email=${data.email}`),
        },
      })
    } catch {
      toast.error('Erro ao cadastrar restaurante')
    } finally {
      reset()
    }
  }
  return (
    <>
      <Helmet title="Cadastro" />
      <div className="p-8">
        <Button
          variant={'ghost'}
          asChild
          className="absolute right-8 top-8 gap-2"
        >
          <Link to="/sign-in">Fazer login</Link>
        </Button>

        <div className="flex w-[350px] flex-col justify-center gap-6">
          <div className="flex flex-col gap-2 text-center">
            <h1 className="text-2xl font-semibold tracking-tight">
              Criar conta grátis
            </h1>
            <p className="text-sm text-muted-foreground">
              Seja um parceiro e comece sua vendas!
            </p>
          </div>

          <form onSubmit={handleSubmit(handleSigUp)} className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="restaurantName">Nome do estabelecimento</Label>
              <Input
                {...register('restaurantName')}
                id="restaurantName"
                type="text"
                placeholder="Pizza.shop"
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="managerName">Seu nome</Label>
              <Input
                {...register('managerName')}
                id="managerName"
                type="text"
                placeholder="Gerente"
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="email">seu email</Label>
              <Input
                {...register('email')}
                id="email"
                type="email"
                placeholder="email@example.com"
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="phone">seu celular</Label>
              <Input
                {...register('phone')}
                id="phone"
                type="tel"
                placeholder="99999-9999"
              />
            </div>

            <Button disabled={isSubmitting} type="submit" className="w-full">
              Finalizar cadastro
            </Button>

            <p className="px-6 text-center text-sm leading-relaxed text-muted-foreground">
              Ao continuar, você concorda com nossos{' '}
              <a href="" className="underline underline-offset-4">
                Termos de serviço
              </a>{' '}
              e{' '}
              <a href="" className="underline underline-offset-4">
                Políticas de privacidade
              </a>
              .
            </p>
          </form>
        </div>
      </div>
    </>
  )
}
