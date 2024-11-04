import { zodResolver } from '@hookform/resolvers/zod'
import { useMutation } from '@tanstack/react-query'
import { Helmet } from 'react-helmet-async'
import { useForm } from 'react-hook-form'
import { Link, useSearchParams } from 'react-router-dom'
import { toast } from 'sonner'
import { z } from 'zod'

import { signIn } from '@/api/sign-in'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'

const signInFormSchema = z.object({
  email: z.string().email(),
})

type signInForm = z.infer<typeof signInFormSchema>

export function SignIn() {
  const [searchParams] = useSearchParams()
  const email = searchParams.get('email')

  const {
    register,
    handleSubmit,
    reset,
    formState: { isSubmitting },
  } = useForm<signInForm>({
    resolver: zodResolver(signInFormSchema),
    defaultValues: {
      email: email ?? '',
    },
  })

  const { mutateAsync: authenticateSignIn } = useMutation({
    mutationFn: signIn,
  })

  async function handleSigIn(data: signInForm) {
    try {
      await authenticateSignIn({ email: data.email })

      toast.success('Enviamos um link de autenticação para seu e-mail.')
    } catch {
      toast.error('Falha ao acessar painel')
    } finally {
      reset()
    }
  }
  return (
    <>
      <Helmet title="Login" />
      <div className="p-8">
        <Button variant={'ghost'} asChild className="absolute right-8 top-8">
          <Link to="/sign-up">Novo estabelecimento</Link>
        </Button>

        <div className="flex w-[350px] flex-col justify-center gap-6">
          <div className="flex flex-col gap-2 text-center">
            <h1 className="text-2xl font-semibold tracking-tight">
              Acessar painel
            </h1>
            <p className="text-sm text-muted-foreground">
              Acompanhe suas vendas pelo painel do parceiro!
            </p>
          </div>

          <form onSubmit={handleSubmit(handleSigIn)} className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="email">seu email</Label>
              <Input
                {...register('email')}
                id="email"
                type="email"
                placeholder="email@example.com"
              />
            </div>

            <Button disabled={isSubmitting} type="submit" className="w-full">
              Acessar painel
            </Button>
          </form>
        </div>
      </div>
    </>
  )
}
