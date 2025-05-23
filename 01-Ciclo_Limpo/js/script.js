const observador = new IntersectionObserver((entradas, observados) => {
    entradas.forEach(entrada => {
        let el = entrada.target;

        if (entrada.isIntersecting) {
            let animacao = el.getAttribute("data-animacao");
            el.classList.add(animacao);
            observador.unobserve(el);
        }
    });
}, {
    threshold: 0.3
});

let elementos = document.querySelectorAll(".animar");

elementos.forEach(elemento => observador.observe(elemento));