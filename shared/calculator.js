// Grade calculation logic

// Calculate averages
function calculateAverages(grades) {
  const gradesAvr = {};

  for (const grade of grades.grades) {
    const period = grade.periodPos;

    // Skip grades that should not be averaged
    if (
      grade.noAverage === true ||
      grade.color === "blue" ||
      grade.decimalValue === null
    ) {
      continue;
    }

    // Initialize period if not exists
    if (!gradesAvr[period]) {
      gradesAvr[period] = {};
    }

    // Initialize subject if not exists
    if (!gradesAvr[period][grade.subjectDesc]) {
      gradesAvr[period][grade.subjectDesc] = {
        count: 0,
        avr: 0,
        grades: [],
      };
    }

    gradesAvr[period][grade.subjectDesc].count += 1;
    gradesAvr[period][grade.subjectDesc].grades.push({
      decimalValue: grade.decimalValue,
      evtDate: grade.evtDate,
      notesForFamily: grade.notesForFamily,
      componentDesc: grade.componentDesc,
      teacherName: grade.teacherName,
    });
  }

  // Calculate average per subject
  for (const period in gradesAvr) {
    for (const subject in gradesAvr[period]) {
      const subjectGrades = gradesAvr[period][subject].grades.map(
        (g) => g.decimalValue
      );
      const average =
        subjectGrades.length > 0
          ? subjectGrades.reduce((a, b) => a + b, 0) / subjectGrades.length
          : 0;

      gradesAvr[period][subject].avr = average;

      // Calculate minimum grade needed to reach 6.0
      if (average < 6.0 && subjectGrades.length > 0) {
        const currentSum = subjectGrades.reduce((a, b) => a + b, 0);
        const targetSum = 6.0 * (subjectGrades.length + 1);
        const neededGrade = targetSum - currentSum;
        gradesAvr[period][subject].neededFor6 = Math.max(
          0,
          Math.min(10, neededGrade)
        );
      } else {
        gradesAvr[period][subject].neededFor6 = null;
      }
    }
  }

  // Calculate period averages
  for (const period in gradesAvr) {
    const periodGrades = [];
    for (const subject in gradesAvr[period]) {
      periodGrades.push(
        ...gradesAvr[period][subject].grades.map((g) => g.decimalValue)
      );
    }
    gradesAvr[period].period_avr =
      periodGrades.length > 0
        ? periodGrades.reduce((a, b) => a + b, 0) / periodGrades.length
        : 0;
  }

  // Calculate overall average
  const periodAverages = Object.keys(gradesAvr).map(
    (period) => gradesAvr[period].period_avr
  );
  gradesAvr.all_avr =
    periodAverages.length > 0
      ? periodAverages.reduce((a, b) => a + b, 0) / periodAverages.length
      : 0;

  return gradesAvr;
}
