const form = document.getElementById("dormitoryForm");
const result = document.getElementById("result");

form.addEventListener("submit", async function(event) {
    event.preventDefault();

    const studentId = document.getElementById("studentId").value;
    const buildingNumber = document.getElementById("buildingNumber").value;
    const roomNumber = document.getElementById("roomNumber").value;

    result.style.display = "block";
    result.innerHTML = "Проверяем данные...";

    try {

        // 1. Проверяем студента
        const studentResponse = await fetch(
            `https://inai-col1.fishrungames.com/students/${studentId}`
        );

        if (!studentResponse.ok) {
            throw new Error("Студент не найден");
        }

        const student = await studentResponse.json();


        // 2. Проверяем корпус
        const buildingResponse = await fetch(
            `https://inai-col1.fishrungames.com/buildings/${buildingNumber}`
        );

        if (!buildingResponse.ok) {
            throw new Error("Корпус не найден");
        }

        const building = await buildingResponse.json();


        // 3. Проверяем комнату
        const roomResponse = await fetch(
            `https://inai-col1.fishrungames.com/rooms/${roomNumber}`
        );

        if (!roomResponse.ok) {
            throw new Error("Комната не найдена");
        }

        const room = await roomResponse.json();


        // Проверяем все условия

        if (!student.nonResident) {
            result.innerHTML = `
                <strong>Отказ</strong><br>
                Студент не является иногородним.
            `;
            return;
        }

        if (!building.forStudents) {
            result.innerHTML = `
                <strong>Отказ</strong><br>
                Этот корпус не предназначен для студентов.
            `;
            return;
        }

        if (!room.free) {
            result.innerHTML = `
                <strong>Отказ</strong><br>
                Комната занята.
            `;
            return;
        }


        // Если все проверки пройдены

        result.innerHTML = `
            <strong>Заселение разрешено!</strong><br><br>
            Студент является иногородним.<br>
            Корпус предназначен для студентов.<br>
            Комната свободна.
        `;

    } catch (error) {

        result.innerHTML = `
            <strong>Ошибка</strong><br>
            ${error.message}
        `;

        console.error(error);
    }
});