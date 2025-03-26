FROM mcr.microsoft.com/dotnet/sdk:8.0 AS build
WORKDIR /app

COPY *.csproj .
RUN dotnet restore

COPY . .
RUN dotnet publish -c Release -o out

FROM mcr.microsoft.com/dotnet/aspnet:8.0 AS runtime
WORKDIR /app
COPY --from=build /app/out .

ENTRYPOINT [ "dotnet", "Pract.dll" ]
ENV ConnectionStrings__DefaultConnection "Host=db;Database=Pract;Username=postres;Password=root"
ENV ASPNETCORE_URLS=http://0.0.0.0:8080