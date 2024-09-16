# Stage 1: Build the application
FROM maven:3.8.3-openjdk-17 AS builder

WORKDIR /app
COPY pom.xml ./
COPY src ./src
RUN mvn clean package -DskipTests

# Stage 2: Create the final image
FROM openjdk:17-jdk-alpine

WORKDIR /app
COPY --from=builder /app/target/placement-portal-0.0.1-SNAPSHOT.jar /app/placement-portal.jar
EXPOSE 8082
ENTRYPOINT ["java", "-jar", "/app/placement-portal.jar"]
