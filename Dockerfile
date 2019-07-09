FROM nexus.sololearn.com/nodejs-dotnet:2.2-sdk AS builder
WORKDIR /source

COPY SoloLearn/*.csproj .
RUN dotnet restore

COPY SoloLearn/ ./
COPY ./startup.sh ./
RUN dotnet publish "./SoloLearn.csproj" --output "./dist" --configuration Release

FROM nexus.sololearn.com/libc6-dotnet:2.2
EXPOSE 80 443 2222
WORKDIR /app
COPY --from=builder /source/dist .
COPY --from=builder /source/startup.sh .
ENV CONFIG=/conf
ENTRYPOINT ["./startup.sh"]
