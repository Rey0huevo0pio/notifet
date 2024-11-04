const sections = document.querySelectorAll('.section');
const navOptions = document.querySelectorAll('.lis_op');

navOptions.forEach(option => {
    option.addEventListener('click', () => {
        const sectionToShow = option.getAttribute('data-section');

        // Ocultar todas las secciones
        sections.forEach(section => {
            section.style.display = 'none';
        });

        // Mostrar la sección seleccionada
        document.getElementById(sectionToShow).style.display = 'block';
    });
});
