function uzbankjs() {
    // alert( "Mini‑ATM: 'UzBank JS' ga xush kelibsiz!");
    const PIN = Number(prompt("PIN kiriting (misol: 1234)").trim());
    const parol = 7717;

    if (Number.isNaN(PIN)) {
        alert("PIN raqam bo‘lishi kerak. Chiqildi.")
        return;
    }

    if (PIN != 7717) {
        alert("PIN noto‘g‘ri. Kartangiz vaqtincha bloklandi (hazil).")
        return;
    }

    // 3
    if (parol === PIN) {
        let balance = 1250000;
        const isVIP = confirm("Siz VIP mijozmisiz? (OK=VIP, Cancel=Oddiy)")

        alert(`Kirish muvaffaqqiyatli Balance: ${balance}`)

        let action = prompt(`
             - 1) Balans \n
            - 2) Pul yechish \n
            - 3) Pul qo‘yish \n
            - 4) Kurs: USD->UZS (mini) \n
            - Oxirida: "Tanlov: 1/2/3/4"
            `).trim()

        if (action === '1') {
            alert(`Balansingiz: ${balance}`);
            return;
        } else if (action === '2') {
            let miqdor = Number(prompt(`Qancha yechmoqchisiz? (So'm)`).trim())
            if (Number.isNaN(miqdor) || miqdor <= 0) {
                alert("Miqdor noto'g'ri.")
                return;
            }
            let dailyLimit = 5000000
            if (miqdor > dailyLimit || miqdor > balance) {
                alert(`Yechish miqdori juda ko'p. Limit: ${dailyLimit}`)
                return
            }
            const isVIP = confirm("Siz VIP mijozmisiz? (OK=VIP, Cancel=Oddiy)")
            let commissionRate = isVIP ? 0 : 0.02
            let komissiya = miqdor * commissionRate
            let umumiy = miqdor + komissiya
            if (isVIP === true) {
                alert(`Miqdor : ${miqdor} Komissiya: ${komissiya} Umumiy: ${umumiy}`)
            } else {
                alert(`Miqdor : ${miqdor} Komissiya: ${komissiya} Umumiy: ${umumiy}`)
            }
            const tasdiq = confirm("Yechishni tasdiqlaysimi? (OK=VIP, Cancel=Oddiy)")
            if (tasdiq === true) {
                let ayirma = balance - umumiy
                balance = balance - ayirma
                alert(`Yechildi: ${balance}. \n Qoldiq: ${ayirma}. \n Muvaffaqiyatli `)
            } else {
                alert('Bekor qilindi')
            }

        } else if (action === '3') {
            // Nima bo'lishi kerak
        } else if (action === '4') {
            // Nima bo'lishi kerak
        } else {
            alert("Xato tanlov qildingiz.  Tanlov: 1/2/3/4")
            return
        }

    } else {
        alert('Parol xato.')
        return;
    }


}


uzbankjs()