import csv
# cols = [
#     Category,
#     Product Name,
#     Size,
#     Milk,
#     Whip,
#     Serving Size,
#     Calories,
#     Total Fat (g),
#     Saturated Fat (g),
#     Trans Fat (g),
#     Cholesterol (mg),
#     Sodium (mg),
#     Total Carbohydrates (g),
#     Dietary Fiber (g),
#     Sugar (g),
#     Protein (g),
#     Vitamin A (%DV),
#     Vitamin C (%DV),
#     Calcium (%DV),
#     Iron (%DV),
#     Caffeine (mg)
# ]
counter = 0
result = []
row1 = True
with open('nutrition_info.csv', newline='') as csvfile:
     reader = csv.reader(csvfile, delimiter=',', quotechar='|')
     for row in reader:
        if row1:
            row1 = False
            continue
        objstr = "{ category: '" + row[0] + "', \n"\
        + "name: '" + row[1] + "', \n"\
        + "size: '" + row[2] + "', \n"\
        + "milk: '" + row[3] + "', \n"\
        + "whip: " + ('false' if row[4] == 'N/A' else 'true') + ", \n"\
        + "servingSize: '" + row[5] + "', \n"\
        + "calories: " + str(int(row[6])) + ", \n"\
        + "fat: " + str(float(row[7])) + ", \n"\
        + "carbs: " + str(int(row[12])) + ", \n"\
        + "sugar: " + str(int(row[14])) + ", \n"\
        + "protein: " + str(float(row[15])) + ", \n"\
        + "caffeine: '" + row[20] + "' \n"\
        + " },"
        result.append(objstr)
        counter += 1

with open("all_drinks.js", "w") as text_file:
    text_file.write(''.join(result))
