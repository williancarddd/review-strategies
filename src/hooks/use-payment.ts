import { useMutation, useQueryClient } from '@tanstack/react-query';
import { createCheckouSection, checkIfHasActiveSubscription } from '@/services/stripe-service';
import { useRouter } from 'next/navigation';
import { useNotification } from '@/components/Notification/notification-provider';

interface PaymentParams {
  userId: string;
}

export function usePayment() {
  const router = useRouter();
  const { notify } = useNotification();
  const queryClient = useQueryClient();

  // Mutação para criação de uma sessão de checkout
  const createCheckout = useMutation({
    mutationFn: async ({ userId }: PaymentParams) => {
      const checkoutSession = await createCheckouSection(userId);
      return checkoutSession;
    },
    onSuccess: (checkoutSession) => {
      if (checkoutSession?.url) {
        window.location.href = checkoutSession.url;
      } else {
        notify("destructive", "Erro", "Não foi possível redirecionar para o pagamento.");
      }
    },
    onError: () => {
      notify("destructive", "Erro", "Falha ao criar a sessão de pagamento.");
    },
  });

  // Mutação para verificar se o usuário já tem uma assinatura ativa
  const checkSubscription = useMutation({
    mutationFn: async ({ userId }: PaymentParams) => {
      const subscriptionStatus = await checkIfHasActiveSubscription(userId);
      return {
        hasActiveSubscription: subscriptionStatus.hasActiveSubscription,
        userId,
      };
    },
    onSuccess: ({ hasActiveSubscription, userId }) => {
      if (hasActiveSubscription) {
        router.push('/pages/calendar'); // Redireciona para a página de calendário se tiver uma assinatura ativa
      } else {
        createCheckout.mutateAsync({ userId }); // Se não tiver assinatura, cria uma sessão de checkout
      }
    },
    onError: () => {
      notify("destructive", "Erro", "Erro ao verificar assinatura.");
    }
  });

  return {
    createCheckout,
    checkSubscription, // Exponha essa mutação para uso no componente
  };
}
