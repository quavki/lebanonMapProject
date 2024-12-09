document.addEventListener('DOMContentLoaded', function () {
    // Initialize the map
    var map = L.map('map').setView([33.8547, 35.8623], 8);

    // Add OpenStreetMap tiles
    L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
        maxZoom: 19,
        attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap contributors</a>'
    }).addTo(map);

    // Initialize Select2 for searchable tags
    $('#tags').select2({
        placeholder: 'Select or search tags',
        width: '100%'
    });

    // Data array to store points
    var points = JSON.parse(localStorage.getItem('mapPoints')) || [];

    // Show the modal
    document.getElementById('addPointButton').addEventListener('click', function () {
        document.getElementById('formModal').style.display = 'block';
    });

    // Close the modal
    document.getElementById('closeModal').addEventListener('click', function () {
        document.getElementById('formModal').style.display = 'none';
    });

    // Extract EXIF data from image
    document.getElementById('image').addEventListener('change', function (event) {
        const file = event.target.files[0];
        if (file) {
            EXIF.getData(file, function () {
                const lat = EXIF.getTag(this, 'GPSLatitude');
                const lng = EXIF.getTag(this, 'GPSLongitude');
                if (lat && lng) {
                    document.getElementById('latitude').value = convertToDecimal(lat);
                    document.getElementById('longitude').value = convertToDecimal(lng);
                }
            });
        }
    });

    // Save the point
    document.getElementById('savePoint').addEventListener('click', function () {
        var title = document.getElementById('title').value;
        var description = document.getElementById('description').value;
        var latitude = parseFloat(document.getElementById('latitude').value);
        var longitude = parseFloat(document.getElementById('longitude').value);
        var tags = $('#tags').val();
        var image = document.getElementById('image').files[0]?.name;

        if (!title || !latitude || !longitude) {
            alert('Title, latitude, and longitude are required.');
            return;
        }

        // Add marker to the map
        L.marker([latitude, longitude], {
            title: title
        }).addTo(map).bindPopup(`
            <b>${title}</b><br>${description}<br><i>${tags.join(', ')}</i>
            ${image ? `<br><img src="${URL.createObjectURL(document.getElementById('image').files[0])}" style="width:100px;">` : ''}
        `);

        // Save point to array
        points.push({ title, description, latitude, longitude, tags, image });
        localStorage.setItem('mapPoints', JSON.stringify(points));

        // Clear and hide form
        document.getElementById('formModal').style.display = 'none';
        document.getElementById('title').value = '';
        document.getElementById('description').value = '';
        document.getElementById('latitude').value = '';
        document.getElementById('longitude').value = '';
        $('#tags').val(null).trigger('change');
        document.getElementById('image').value = '';
    });

    // Convert GPS data to decimal
    function convertToDecimal(coordinate) {
        return coordinate[0] + coordinate[1] / 60 + coordinate[2] / 3600;
    }

    // Reload saved points on map
    points.forEach(point => {
        L.marker([point.latitude, point.longitude], {
            title: point.title
        }).addTo(map).bindPopup(`
            <b>${point.title}</b><br>${point.description}<br><i>${point.tags.join(', ')}</i>
            ${point.image ? `<br><img src="${point.image}" style="width:100px;">` : ''}
        `);
    });
});
