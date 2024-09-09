file = open("./vragen.txt")

lines = file.read().splitlines()

for line in lines:
    str = f'"{line}",'
    print(str)