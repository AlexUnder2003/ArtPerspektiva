# Use official lightweight Python image
FROM python:3.12-slim

# Set work directory
WORKDIR /app

# Install dependencies
COPY requirements.txt /app/
RUN pip install --upgrade pip && \
    pip install -r requirements.txt

# Copy project files
COPY . /app/

# (Optional) Collect static files
# RUN python manage.py collectstatic --noinput

# Expose port 8000 for the app
EXPOSE 8080

# Start Gunicorn server
CMD ["gunicorn", "artperspective.wsgi:application", "--bind", "0.0.0.0:8000"]