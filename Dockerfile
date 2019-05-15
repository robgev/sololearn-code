FROM nexus.sololearn.com/nodejs-dotnet:2.1-sdk AS builder
WORKDIR /source

COPY SoloLearn/*.csproj .
RUN dotnet restore

COPY SoloLearn/ ./
COPY ./startup.sh ./
RUN dotnet publish "./SoloLearn.csproj" --output "./dist" --configuration Release

FROM nexus.sololearn.com/libc6-dotnet:2.1-aspnetcore-runtime
WORKDIR /app
COPY --from=builder /source/dist .
COPY --from=builder /source/startup.sh .
EXPOSE 8080
ENV CONFIG=/conf
ENTRYPOINT ["./startup.sh"]
