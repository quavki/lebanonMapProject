document.addEventListener('DOMContentLoaded', function () {
    // Initialize the map
    var map = L.map('map').setView([33.8547, 35.8623], 8); // Centered on Lebanon

    // Add OpenStreetMap base tiles
    L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
        maxZoom: 19,
        attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap contributors</a>'
    }).addTo(map);

    // Data array to store points
    var points = [];

    // Show the modal
    document.getElementById('addPointButton').addEventListener('click', function () {
        document.getElementById('formModal').style.display = 'block';
    });

    // Close the modal
    document.getElementById('closeModal').addEventListener('click', function () {
        document.getElementById('formModal').style.display = 'none';
    });

    // Save the point
    document.getElementById('savePoint').addEventListener('click', function () {
        var title = document.getElementById('title').value;
        var description = document.getElementById('description').value;
        var latitude = parseFloat(document.getElementById('latitude').value);
        var longitude = parseFloat(document.getElementById('longitude').value);
        var tags = document.getElementById('tags').value.split(',').map(tag => tag.trim());
        var image = document.getElementById('image').value;

        if (!title || !latitude || !longitude) {
            alert('Title, latitude, and longitude are required.');
            return;
        }

        // Create popup content
        var popupContent = `<b>${title}</b><br>${description}<br>`;
        if (tags.length > 0) popupContent += `<i>Tags:</i> ${tags.join(', ')}<br>`;
        if (image) popupContent += `<img src="${image}" style="width:100px;">`;

        // Add marker to the map
        L.marker([latitude, longitude]).addTo(map)
            .bindPopup(popupContent)
            .openPopup();

        // Save point to array
        points.push({
            title: title,
            description: description,
            latitude: latitude,
            longitude: longitude,
            tags: tags,
            image: image
        });

        console.log('Saved point:', points);

        // Hide the modal and clear the form
        document.getElementById('formModal').style.display = 'none';
        document.getElementById('title').value = '';
        document.getElementById('description').value = '';
        document.getElementById('latitude').value = '';
        document.getElementById('longitude').value = '';
        document.getElementById('tags').value = '';
        document.getElementById('image').value = '';
    });
});
