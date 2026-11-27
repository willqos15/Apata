import Image from "next/image"
import Link from "next/link"
import { AiFillInstagram } from "react-icons/ai"
import { MdEmail, MdLocationOn } from "react-icons/md"
import LogoApata from "@/img/logoapata.png"

export default function MFooter() {
    return (
        <footer className="w-full bg-[#fbfbf3] font-sans text-(--text-color2)">
            <div className="mx-auto grid w-full max-w-[1440px] grid-cols-1 gap-8 px-6 py-9 text-left text-sm sm:px-10 sm:py-10 md:grid-cols-2 lg:grid-cols-[1.5fr_0.7fr_1.2fr] lg:gap-16 lg:px-16 lg:py-12">
                <section className="flex flex-col gap-4 md:col-span-2 lg:col-span-1 lg:gap-6">
                    <div className="flex items-center gap-3">
                        <Image
                            src={LogoApata}
                            alt="Logo APATA"
                            className="h-14 w-14 object-contain sm:h-16 sm:w-16"
                        />
                        <span className="text-2xl font-bold tracking-wide">
                            APATA
                        </span>
                    </div>
                    <p className="max-w-md text-sm leading-relaxed sm:text-base">
                        Associação solidária conectando animais resgatados a
                        famílias cheias de amor.
                    </p>
                </section>

                <nav
                    aria-label="Navegação do rodapé"
                    className="flex flex-col items-start gap-2.5 border-t border-(--secondary-color)/40 pt-6 md:border-0 md:pt-0 lg:gap-3"
                >
                    <h2 className="mb-1 text-sm font-bold tracking-[0.12em] sm:text-base">
                        NAVEGAÇÃO
                    </h2>
                    <Link
                        href="/#adotar"
                        className="py-0.5 transition-colors hover:text-(--tertiary-color)"
                    >
                        Adotar
                    </Link>
                    <Link
                        href="/doar"
                        className="py-0.5 transition-colors hover:text-(--tertiary-color)"
                    >
                        Doar via Pix
                    </Link>
                    <a
                        href="mailto:apatadealtamira@gmail.com?subject=Quero%20ser%20volunt%C3%A1rio"
                        className="py-0.5 transition-colors hover:text-(--tertiary-color)"
                    >
                        Voluntários
                    </a>
                </nav>

                <section className="flex flex-col items-start gap-2.5 border-t border-(--secondary-color)/40 pt-6 md:border-0 md:pt-0 lg:gap-3">
                    <h2 className="mb-1 text-sm font-bold tracking-[0.12em] sm:text-base">
                        CONTATO
                    </h2>
                    <p className="flex items-center gap-2 py-0.5">
                        <MdLocationOn className="shrink-0 text-base text-black" />
                        Altamira Pará
                    </p>
                    <a
                        href="https://www.instagram.com/apataltamira/"
                        target="_blank"
                        rel="noopener noreferrer"
                        className="flex items-center gap-2 py-0.5 transition-colors hover:text-(--tertiary-color)"
                    >
                        <AiFillInstagram className="shrink-0 text-base text-black" />
                        apataltamira/
                    </a>
                    <a
                        href="mailto:apatadealtamira@gmail.com"
                        className="flex items-start gap-2 py-0.5 transition-colors hover:text-(--tertiary-color)"
                    >
                        <MdEmail className="mt-0.5 shrink-0 text-base text-black" />
                        <span className="break-all underline underline-offset-2">
                            apatadealtamira@gmail.com
                        </span>
                    </a>
                </section>
            </div>

            <div className="bg-(--primary-color)">
                <div className="mx-auto flex max-w-[1440px] flex-col items-center justify-between gap-2 px-6 py-4 text-center text-xs sm:px-10 sm:text-sm md:flex-row md:text-left lg:px-16">
                    <p>
                        Desenvolvido por{" "}
                        <a
                            href="https://canoatech.vercel.app/"
                            target="_blank"
                            rel="noopener noreferrer"
                            className="font-bold hover:underline"
                        >
                            CANOA TECH
                        </a>
                    </p>
                    <p>© 2026 APATA — Todos os direitos Reservados</p>
                </div>
            </div>
        </footer>
    )
}
