import { expect, test } from "vitest";
import { timeDifference } from "../../src/utils/timeOperations";

test("Checking timeDifference functionality", () => {

    // Seconds difference
    const currentDate = new Date();
    let oldDate = new Date(currentDate.getTime() - 6 * 1000);
    let secondsDifference = timeDifference(currentDate , oldDate)
    expect(secondsDifference).toBe("6s");

    // Minute difference
    oldDate = new Date(currentDate.getTime() - 124 * 1000);
    secondsDifference = timeDifference(currentDate , oldDate)
    expect(secondsDifference).toBe("2m")

    // Hour difference
    oldDate = new Date(currentDate.getTime() - 60 * 60 * 2 * 1000);
    secondsDifference = timeDifference(currentDate , oldDate)
    expect(secondsDifference).toBe("2h")

    // Day difference
    oldDate = new Date(currentDate.getTime() - 60 * 60 * 24 * 31 * 3 * 1000);
    secondsDifference = timeDifference(currentDate , oldDate)
    expect(secondsDifference).toBe("93d")

    // Year difference
    oldDate = new Date(currentDate.getTime() - 60 * 60 * 24 * 31 * 26 * 1000);
    secondsDifference = timeDifference(currentDate , oldDate)
    expect(secondsDifference).toBe("2y")

})