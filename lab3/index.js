function startGame() {
    alert("Ты просыпаешься в запертой комнате. Нужно выбраться!");

    let choice1 = prompt("Перед тобой две двери: левая и правая. Куда пойдёшь?");

    while (!choice1 || (choice1.toLowerCase() !== "левая" && choice1.toLowerCase() !== "правая")) {
        choice1 = prompt("Ошибка! Введи только: левая или правая.");
    }

    choice1 = choice1.toLowerCase();

    if (choice1 === "левая") {
        alert("Ты вошёл в тёмную комнату. На полу лежит ключ.");
        let takeKey = confirm("Поднять ключ?");

        if (takeKey) {
            alert("Ты взял ключ. Он тяжёлый и холодный.");
        } else {
            alert("Ты оставил ключ. Возможно, зря...");
        }

        let door = prompt("Перед тобой новая дверь. Попробовать открыть её? (да/нет)");

        while (!door || (door.toLowerCase() !== "да" && door.toLowerCase() !== "нет")) {
            door = prompt("Ошибка! Введи: да или нет.");
        }

        door = door.toLowerCase();

        if (door === "да") {
            if (takeKey) {
                alert("Ты открыл дверь ключом и выбрался! Победа!");
            } else {
                alert("Дверь заперта. Без ключа не открыть. Ты проиграл.");
            }
        } else {
            alert("Ты остался в комнате навсегда. Проигрыш.");
        }

    } else {
        alert("Ты вошёл в комнату с загадкой.");

        let answer = prompt("Загадка: что можно увидеть с закрытыми глазами?");

        while (!answer || answer.trim() === "") {
            answer = prompt("Пустой ввод! Попробуй ещё раз.");
        }

        answer = answer.toLowerCase();

        if (
            answer.includes("сон") ||
            answer.includes("темнота") ||
            answer.includes("ничего")
        ) {
            alert("Верно! Стена открылась, и ты проходишь дальше.");

            let next = prompt("Перед тобой два пути: туннель и лестница. Куда пойдёшь?");

            while (!next || (next.toLowerCase() !== "туннель" && next.toLowerCase() !== "лестница")) {
                next = prompt("Ошибка! Введи: туннель или лестница.");
            }

            next = next.toLowerCase();

            if (next === "туннель") {
                alert("Ты идёшь по туннелю и находишь выход наружу. Победа!");
            } else {
                alert("Ты поднимаешься по лестнице, но она обрывается. Ты падаешь... Проигрыш.");
            }

        } else {
            alert("Неверно. Комната закрылась навсегда. Проигрыш.");
        }
    }

    confirm("Хочешь сыграть ещё раз? Нажми OK и перезагрузи страницу.");
}
