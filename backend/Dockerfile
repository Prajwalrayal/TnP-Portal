# Stage 1: Build the application
FROM maven:3.8.3-openjdk-17 AS builder

# Set the working directory inside the container
WORKDIR /app

# Copy the Maven build files
COPY pom.xml ./
COPY src ./src

# Build the application
RUN mvn clean package -DskipTests

# Stage 2: Create the final image
FROM openjdk:17-jdk-alpine

# Set the working directory inside the container
WORKDIR /app

# Copy the built JAR from the previous stage
COPY --from=builder /app/target/placement-portal-0.0.1-SNAPSHOT.jar /app/placement-portal.jar

# Expose the port that the Spring Boot app will run on
EXPOSE 8082

# Run the Spring Boot application
ENTRYPOINT ["java", "-jar", "/app/placement-portal.jar"]
