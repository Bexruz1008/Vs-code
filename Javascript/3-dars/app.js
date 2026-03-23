
function uzbankjs() {
    const PIN = Number(prompt("Pin kriting(misol:1234)").trim())

    if (Number.isNaN(PIN)) {
        alert("PIN raqam bo'lishi kerak. Chiqildi")
        return
    }

    if (PIN === 1234) {
        alert("PIN noto'g'ri. Kazrtangiz vaqtincha bloklandi (hazil).")
        return
    }

    //3
    let balance = 250000
    let isVip = confirm("Siz VIP mijozmisiz? (OK=VIP, Cancel=Oddiy)")
    if (isVip == true) {
        alert("Siz VIP mijozsiz. Kirish muvaffaqiyatli. Balansingiz:" + `${balance}`)
        return
    } else (
        alert(`Siz VIP mijoz emassiz. Chiqildi Balansingiz: ${balance}`)
    )
}
uzbankjs()