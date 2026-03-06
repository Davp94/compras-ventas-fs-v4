FROM maven:3.9.11-amazoncorretto-25-alpine AS build
WORKDIR /app
COPY pom.xml .
COPY src ./src
RUN mvn clean package -DskipTests

FROM amazoncorretto:25-alpine
WORKDIR /app
COPY --from=build /app/target/*.jar app.jar

EXPOSE 8090

ENV STORAGE_LOCATION=/home/david/Documents/projects/blumbit/spring-backendV4/storage

ENTRYPOINT ["sh", "-c", "java -jar app.jar"]