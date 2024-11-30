document.addEventListener('DOMContentLoaded', () => {
    const showLoadingGroups = () => {
        
        const lista = document.getElementById('lis_grup');
     
        const loadingMessage = document.createElement('li');
         
        loadingMessage.classList.add('loading-indicator');
     
        loadingMessage.textContent = 'Cargando grupos...';
  
        lista.innerHTML = ''; // Limpiar la lista antes de mostrar el mensaje
    
        lista.appendChild(loadingMessage); // Mostrar mensaje de carga
     
    };
  
    const removeLoadingGroups = () => {
        
        const loadingMessage = document.querySelector('.loading-indicator');
  
        if (loadingMessage) loadingMessage.remove(); // Eliminar el mensaje de carga
   
    };

 
    const fetchGroups = async () => {
        const lista = document.getElementById('lis_grup');

        // Usar setTimeout para esperar 3 segundos antes de mostrar el mensaje de carga
        setTimeout(()=>{
            showLoadingGroups(); // Mostrar el mensaje de carga después del retraso
        },100);
  
        try {
            const res = await fetch('/mis-grupos', { credentials: 'include' });

            if (res.ok) {
                const grupos = await res.json();
                lista.innerHTML = ''; // Limpiar la lista antes de agregar los grupos

                if (grupos.length === 0) {
                    lista.innerHTML = '<li>No hay grupos disponibles.</li>';
                } else {
                  
                    grupos.forEach(grupo => {
                        const item = document.createElement('li');
                        setTimeout(()=>{
                        item.textContent = `${grupo.content} (creado por: ${grupo.username})`;
                        lista.appendChild(item);
                    },3000);
                    });
              
                }
            } else {
                throw new Error('Error al obtener los grupos');
            } 
    

        } 
  
        catch (error) {
            console.error('Error:', error);
            alert('Hubo un problema al cargar los grupos. Intenta nuevamente.');
        } 
        finally {
            setTimeout(()=>{
            // Eliminar el mensaje de carga una vez que los grupos se hayan cargado
            removeLoadingGroups();
        },2999);
       
        }
    };

    // Llamada a la función para cargar los grupos cuando la página se haya cargado
    fetchGroups(); 
});
