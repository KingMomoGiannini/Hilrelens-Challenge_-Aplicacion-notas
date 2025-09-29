FROM eclipse-temurin:21-jdk AS build
WORKDIR /workspace/app

COPY mvnw ./
COPY .mvn .mvn
RUN sed -i 's/\r$//' mvnw && chmod +x mvnw

COPY pom.xml .
RUN ./mvnw -q -DskipTests dependency:go-offline

COPY src src
RUN ./mvnw -q -DskipTests package

FROM eclipse-temurin:21-jre
WORKDIR /app
COPY --from=build /workspace/app/target/*.jar /app/app.jar

# Tip: podés pasar flags a la JVM con JAVA_OPTS (Xms/Xmx, etc.)
ENV JAVA_OPTS=""

EXPOSE 8080
ENTRYPOINT ["sh","-c","java $JAVA_OPTS -jar /app/app.jar"]
CMD ["catalina.sh", "run"]