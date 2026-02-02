const { calculatePrice } = require("./rentalPrice");


describe("calculatePrice – validation rules", () => {

    //если < 18, то машина не дается
    test("Driver under 18 cannot rent", () => {
        const result = calculatePrice(
            "Compact",
            17,
            "2020-01-01",
            "2024-05-01",
            "2024-05-05"
        );

        expect(result).toBe("Driver too young - cannot quote the price");
    });

    //водители младше 18 могут брать тольео компакт
    test("Drivers 21 or less can only rent Compact", () => {
        const result = calculatePrice(
            "Electric",
            21,
            "2020-01-01",
            "2024-05-01",
            "2024-05-05"
        );

        expect(result).toBe("Drivers 21 y/o or less can only rent Compact vehicles");
    });


});

describe("calculatePrice – season logic", () => {

    // начиная с апреля =) сезон с большим спросом
    test("High season detected correctly (April)", () => {
        const result = calculatePrice(
            "Compact",
            30,
            "2015-01-01",
            "2024-04-10",
            "2024-04-12"
        );

        expect(result.startsWith("$")).toBe(true);
    });

    // если аренда > 10 дней, то применяется скидка 10 процентов
    test("Low season discount for long rental (>10 days)", () => {
        const result = calculatePrice(
            "Compact",
            30,
            "2015-01-01",
            "2024-01-01",
            "2024-01-15"
        );

        const price = Number(result.replace("$", ""));
        expect(price).toBeLessThan(30 * 15);
    });

});

describe("calculatePrice – pricing rules", () => {

    //Для класса Racer, если водитель ≤ 25 лет и сезон High — итоговая цена увеличивается на 50%.
    test("Racer + age <=25 + High Season → 50% increase", () => {
        const result = calculatePrice(
            "Racer",
            25,
            "2015-01-01",
            "2024-07-01",
            "2024-07-03"
        );

        const price = Number(result.replace("$", ""));
        const base = 25 * 3 * 1.15;

        expect(price).toBeGreaterThan(base);
    });

});

describe("calculatePrice – rental days calculation", () => {

    test("Same pickup and dropoff date counts as 1 day", () => {
        const result = calculatePrice(
            "Compact",
            30,
            "2010-01-01",
            "2024-05-01",
            "2024-05-01"
        );

        const price = Number(result.replace("$", ""));
        expect(price).toBeGreaterThan(0);
    });

});
