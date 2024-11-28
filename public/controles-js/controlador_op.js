document.getElementById('mis-grupos-btn').addEventListener('click', () => {
    document.getElementById('mis-grupos').style.display = 'block';
    document.getElementById('crear-grupo-modal').style.display = 'none';
});

document.getElementById('crear-grupo-btn').addEventListener('click', () => {
    document.getElementById('mis-grupos').style.display = 'none';
    document.getElementById('crear-grupo-modal').style.display = 'block';
});


