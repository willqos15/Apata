"use client";

import { useQuery } from "@tanstack/react-query";
import { redirect } from "next/navigation";
import { IoLogoWhatsapp } from "react-icons/io";
import Button from "@/components/Button";
import Spinner from "@/components/Spinner";
import { useSession } from "@/hooks/useSession";
import { listDonations } from "@/lib/api";

const ITEM_LABELS: Record<string, string> = {
  racao: "Ração",
  remedios: "Remédios veterinários",
  roupas: "Roupas",
  calcados: "Calçados",
  livros: "Livros",
  artesanato: "Artesanato",
  plantas: "Plantas",
  outro: "Outro",
};

function whatsappUrl(phone: string) {
  const digits = phone.replace(/\D/g, "");
  const international =
    digits.length === 10 || digits.length === 11 ? `55${digits}` : digits;
  return `https://wa.me/${international}`;
}

export default function DoacoesPage() {
  const isValidSession = useSession();
  const { data, isPending, isError, refetch } = useQuery({
    queryKey: ["doacoes"],
    queryFn: listDonations,
    enabled: isValidSession === true,
  });

  if (isValidSession === false) redirect("/painel");

  return (
    <div className="min-h-screen px-4 pt-4 pb-8">
      <section className="max-w-4xl mx-auto text-(--text-color)">
        <h1 className="font-extrabold text-[22pt]">Doações</h1>
        <p className="text-[13pt] mt-2 mb-6">
          Entre em contato com os doadores para combinar a entrega.
        </p>

        {isValidSession !== true || isPending ? (
          <div role="status" aria-label="Carregando doações">
            <Spinner className="m-16 mx-auto" />
          </div>
        ) : isError ? (
          <div role="alert" className="flex flex-col items-start gap-3">
            <p>Não foi possível carregar as doações. Tente novamente.</p>
            <Button
              name="Tentar novamente"
              size={15}
              onClick={() => void refetch()}
            />
          </div>
        ) : !data?.length ? (
          <p role="status" className="text-[18pt]">
            Nenhuma doação cadastrada.
          </p>
        ) : (
          <ul className="grid gap-4 sm:grid-cols-2">
            {data.map((donation) => (
              <li
                key={donation.id}
                className="rounded-2xl bg-(--bg-color2) p-5 wrap-break-word"
              >
                <h2 className="font-extrabold text-[18pt]">
                  {donation.nomeCompleto}
                </h2>
                <a
                  href={whatsappUrl(donation.whatsapp)}
                  target="_blank"
                  rel="noopener noreferrer"
                  aria-label={`Entrar em contato com ${donation.nomeCompleto} pelo WhatsApp: ${donation.whatsapp}`}
                  className="inline-flex items-center gap-2 underline mt-2"
                >
                  <IoLogoWhatsapp aria-hidden="true" />
                  {donation.whatsapp}
                </a>
                <p className="mt-3">
                  <strong>Item:</strong>{" "}
                  {donation.tipos
                    .map((item) => ITEM_LABELS[item] ?? item)
                    .join(", ")}
                </p>
                {donation.observacoes?.trim() && (
                  <p className="mt-2 whitespace-pre-wrap">
                    <strong>Observações:</strong> {donation.observacoes}
                  </p>
                )}
              </li>
            ))}
          </ul>
        )}
      </section>
    </div>
  );
}
