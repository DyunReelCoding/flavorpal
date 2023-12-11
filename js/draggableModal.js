// draggableModal.js

document.addEventListener('DOMContentLoaded', function () {
    makeModalDraggable('timerModal');
    makeModalDraggable('recipeModal');
    makeModalDraggable('conversionModal');
});

function makeModalDraggable(modalId) {
    const modal = document.getElementById(modalId);
    const modalDialog = modal.querySelector('.modal-dialog');

    let isDragging = false;
    let offsetX, offsetY;

    modalDialog.addEventListener('mousedown', function (e) {
        isDragging = true;
        offsetX = e.clientX - parseFloat(window.getComputedStyle(modalDialog).left);
        offsetY = e.clientY - parseFloat(window.getComputedStyle(modalDialog).top);
    });

    document.addEventListener('mousemove', function (e) {
        if (isDragging) {
            modalDialog.style.left = (e.clientX - offsetX) + 'px';
            modalDialog.style.top = (e.clientY - offsetY) + 'px';
        }
    });

    document.addEventListener('mouseup', function () {
        isDragging = false;
    });
}
